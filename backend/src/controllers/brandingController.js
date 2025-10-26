export const getFormBranding = async (req, res) => {
  const { formId } = req.params;

  try {
    const { data, error } = await supabase
      .from("form_branding")
      .select("*")
      .eq("form_id", formId)
      .single();

    // If no branding exists, return defaults
    if (error && error.code === "PGRST116") {
      return res.status(200).json({
        branding: {
          primary_color: "#000000",
          secondary_color: "#ffffff",
          background_color: "#ffffff",
          text_color: "#000000",
          button_color: "#000000",
          button_text_color: "#ffffff",
          font_family: "Inter",
          heading_font_size: 24,
          body_font_size: 16,
          form_width: "medium",
          border_radius: 8,
        },
      });
    }

    if (error) throw error;

    return res.status(200).json({ branding: data });
  } catch (err) {
    console.error("Get branding error:", err);
    return res.status(500).json({ error: "Failed to fetch branding" });
  }
};

// Update or create form branding
export const updateFormBranding = async (req, res) => {
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

    const brandingData = {
      form_id: formId,
      primary_color: req.body.primary_color,
      secondary_color: req.body.secondary_color,
      background_color: req.body.background_color,
      text_color: req.body.text_color,
      button_color: req.body.button_color,
      button_text_color: req.body.button_text_color,
      logo_url: req.body.logo_url,
      logo_storage_path: req.body.logo_storage_path,
      logo_position: req.body.logo_position,
      font_family: req.body.font_family,
      heading_font_size: req.body.heading_font_size,
      body_font_size: req.body.body_font_size,
      form_width: req.body.form_width,
      border_radius: req.body.border_radius,
      custom_css: req.body.custom_css,
      updated_at: new Date().toISOString(),
    };

    // Upsert (insert or update)
    const { data, error } = await supabase
      .from("form_branding")
      .upsert(brandingData, { onConflict: "form_id" })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: "Branding updated successfully",
      branding: data,
    });
  } catch (err) {
    console.error("Update branding error:", err);
    return res.status(500).json({ error: "Failed to update branding" });
  }
};

// Upload logo
export const uploadLogo = async (req, res) => {
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

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${userId}/${formId}/logo_${uuidv4()}.${fileExt}`;

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

    // Update branding with logo
    const { data: branding, error: brandingError } = await supabase
      .from("form_branding")
      .upsert(
        {
          form_id: formId,
          logo_url: urlData.publicUrl,
          logo_storage_path: fileName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "form_id" }
      )
      .select()
      .single();

    if (brandingError) throw brandingError;

    return res.status(200).json({
      message: "Logo uploaded successfully",
      logo_url: urlData.publicUrl,
      branding,
    });
  } catch (err) {
    console.error("Upload logo error:", err);
    return res.status(500).json({ error: "Failed to upload logo" });
  }
};
