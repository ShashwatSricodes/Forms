// 📦 backend/src/controllers/mediaController.js
// Handle image/video uploads for forms
// ============================================
import supabase from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

// Upload media (image/video) to form
export const uploadFormMedia = async (req, res) => {
  const { formId } = req.params;
  const userId = req.user.id;

  try {
    // Check if user owns the form
    const { data: form } = await supabase
      .from("forms")
      .select("created_by")
      .eq("id", formId)
      .single();

    if (!form || form.created_by !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${userId}/${formId}/${uuidv4()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("form-media")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("form-media")
      .getPublicUrl(fileName);

    // Save media info to database
    const mediaType = file.mimetype.startsWith("video/") ? "video" : "image";

    const { data: mediaRecord, error: dbError } = await supabase
      .from("form_media")
      .insert({
        form_id: formId,
        question_id: req.body.question_id || null,
        media_type: mediaType,
        media_url: urlData.publicUrl,
        storage_path: fileName,
        file_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype,
        position: req.body.position || "top",
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return res.status(201).json({
      message: "Media uploaded successfully",
      media: mediaRecord,
    });
  } catch (err) {
    console.error("Upload media error:", err);
    return res.status(500).json({ error: "Failed to upload media" });
  }
};

// Get all media for a form
export const getFormMedia = async (req, res) => {
  const { formId } = req.params;

  try {
    const { data, error } = await supabase
      .from("form_media")
      .select("*")
      .eq("form_id", formId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return res.status(200).json({ media: data });
  } catch (err) {
    console.error("Get media error:", err);
    return res.status(500).json({ error: "Failed to fetch media" });
  }
};

// Delete media
export const deleteFormMedia = async (req, res) => {
  const { mediaId } = req.params;
  const userId = req.user.id;

  try {
    // Get media with form ownership check
    const { data: media, error: mediaError } = await supabase
      .from("form_media")
      .select("*, forms!inner(created_by)")
      .eq("id", mediaId)
      .single();

    if (mediaError || !media) {
      return res.status(404).json({ error: "Media not found" });
    }

    if (media.forms.created_by !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("form-media")
      .remove([media.storage_path]);

    if (storageError) console.error("Storage delete error:", storageError);

    // Delete from database
    const { error: dbError } = await supabase
      .from("form_media")
      .delete()
      .eq("id", mediaId);

    if (dbError) throw dbError;

    return res.status(200).json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Delete media error:", err);
    return res.status(500).json({ error: "Failed to delete media" });
  }
};
