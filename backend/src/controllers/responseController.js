// backend/src/controllers/responseController.js
import supabase from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

// Submit a response (UPDATED - handles file uploads and signatures)
export const submitResponse = async (req, res) => {
  const { formId } = req.params;
  const { answers } = req.body; // Array of { question_id, answer_text, selected_options, file_data }

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Answers array is required" });
  }

  try {
    // Check if form exists and is public
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("id, is_public")
      .eq("id", formId)
      .single();

    if (formError || !form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (!form.is_public) {
      return res.status(403).json({ error: "Form is not public" });
    }

    // Create response
    const { data: response, error: responseError } = await supabase
      .from("responses")
      .insert({ form_id: formId })
      .select()
      .single();

    if (responseError) throw responseError;

    // Process each answer
    const answersToInsert = await Promise.all(
      answers.map(async (answer) => {
        const answerData = {
          response_id: response.id,
          question_id: answer.question_id,
          answer_text: answer.answer_text || null,
          selected_options: answer.selected_options || null,
        };

        // Handle file upload if present
        if (answer.file_data) {
          try {
            const fileBuffer = Buffer.from(answer.file_data.content, "base64");
            const fileExt = answer.file_data.name.split(".").pop();
            const fileName = `${formId}/${response.id}/${uuidv4()}.${fileExt}`;

            // Determine bucket based on question type
            const bucket =
              answer.question_type === "signature"
                ? "signatures"
                : "response-files";

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } =
              await supabase.storage.from(bucket).upload(fileName, fileBuffer, {
                contentType: answer.file_data.type,
                upsert: false,
              });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
              .from(bucket)
              .getPublicUrl(fileName);

            answerData.file_url = urlData.publicUrl;
            answerData.file_name = answer.file_data.name;
            answerData.file_size = fileBuffer.length;
            answerData.storage_path = fileName;
          } catch (fileError) {
            console.error("File upload error:", fileError);
            // Continue without file if upload fails
          }
        }

        return answerData;
      })
    );

    // Insert all answers
    const { error: answersError } = await supabase
      .from("answers")
      .insert(answersToInsert);

    if (answersError) throw answersError;

    return res.status(201).json({
      message: "Response submitted successfully",
      response_id: response.id,
    });
  } catch (err) {
    console.error("Submit response error:", err);
    return res.status(500).json({ error: "Failed to submit response" });
  }
};

// Get all responses for a form (owner only)
export const getFormResponses = async (req, res) => {
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

    // Get all responses with answers
    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select("*")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false });

    if (responsesError) throw responsesError;

    // Get answers for each response
    const responsesWithAnswers = await Promise.all(
      responses.map(async (response) => {
        const { data: answers } = await supabase
          .from("answers")
          .select(
            `
            *,
            questions (
              question_text,
              question_type
            )
          `
          )
          .eq("response_id", response.id);

        return {
          ...response,
          answers: answers || [],
        };
      })
    );

    return res.status(200).json({
      responses: responsesWithAnswers,
      total: responsesWithAnswers.length,
    });
  } catch (err) {
    console.error("Get responses error:", err);
    return res.status(500).json({ error: "Failed to fetch responses" });
  }
};

// Get single response (owner only)
export const getResponseById = async (req, res) => {
  const { responseId } = req.params;
  const userId = req.user.id;

  try {
    // Get response with form ownership check
    const { data: response, error: responseError } = await supabase
      .from("responses")
      .select(
        `
        *,
        forms!inner (
          created_by,
          title
        )
      `
      )
      .eq("id", responseId)
      .single();

    if (responseError || !response) {
      return res.status(404).json({ error: "Response not found" });
    }

    if (response.forms.created_by !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Get answers
    const { data: answers } = await supabase
      .from("answers")
      .select(
        `
        *,
        questions (
          question_text,
          question_type
        )
      `
      )
      .eq("response_id", responseId);

    return res.status(200).json({
      response: {
        ...response,
        answers: answers || [],
      },
    });
  } catch (err) {
    console.error("Get response error:", err);
    return res.status(500).json({ error: "Failed to fetch response" });
  }
};

// Delete response (owner only)
export const deleteResponse = async (req, res) => {
  const { responseId } = req.params;
  const userId = req.user.id;

  try {
    // Check ownership
    const { data: response } = await supabase
      .from("responses")
      .select(
        `
        id,
        forms!inner (
          created_by
        )
      `
      )
      .eq("id", responseId)
      .single();

    if (!response || response.forms.created_by !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
      .from("responses")
      .delete()
      .eq("id", responseId);

    if (error) throw error;

    return res.status(200).json({ message: "Response deleted successfully" });
  } catch (err) {
    console.error("Delete response error:", err);
    return res.status(500).json({ error: "Failed to delete response" });
  }
};
