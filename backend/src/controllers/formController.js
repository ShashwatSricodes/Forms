// backend/src/controllers/formController.js
import supabase from "../../supabaseClient.js";

// Create a new form
export const createForm = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ error: "Form title is required" });
  }

  try {
    const { data, error } = await supabase
      .from("forms")
      .insert({
        title,
        description,
        created_by: userId,
        is_public: false,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Form created successfully",
      form: data,
    });
  } catch (err) {
    console.error("Create form error:", err);
    return res.status(500).json({ error: "Failed to create form" });
  }
};

// Get all forms for logged-in user
export const getUserForms = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({ forms: data });
  } catch (err) {
    console.error("Get forms error:", err);
    return res.status(500).json({ error: "Failed to fetch forms" });
  }
};

// Get single form with all questions and options
export const getFormById = async (req, res) => {
  const { formId } = req.params;

  try {
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .single();

    if (formError) throw formError;

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Get questions with options
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("form_id", formId)
      .order("order_index", { ascending: true });

    if (questionsError) throw questionsError;

    // Get options for each question
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const { data: options } = await supabase
          .from("options")
          .select("*")
          .eq("question_id", question.id)
          .order("order_index", { ascending: true });

        return {
          ...question,
          options: options || [],
        };
      })
    );

    return res.status(200).json({
      form: {
        ...form,
        questions: questionsWithOptions,
      },
    });
  } catch (err) {
    console.error("Get form error:", err);
    return res.status(500).json({ error: "Failed to fetch form" });
  }
};

// Update form
export const updateForm = async (req, res) => {
  const { formId } = req.params;
  const { title, description, is_public } = req.body;
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

    const { data, error } = await supabase
      .from("forms")
      .update({ title, description, is_public })
      .eq("id", formId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: "Form updated successfully",
      form: data,
    });
  } catch (err) {
    console.error("Update form error:", err);
    return res.status(500).json({ error: "Failed to update form" });
  }
};

// Delete form
export const deleteForm = async (req, res) => {
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

    const { error } = await supabase.from("forms").delete().eq("id", formId);

    if (error) throw error;

    return res.status(200).json({ message: "Form deleted successfully" });
  } catch (err) {
    console.error("Delete form error:", err);
    return res.status(500).json({ error: "Failed to delete form" });
  }
};

// Add question to form
export const addQuestion = async (req, res) => {
  const { formId } = req.params;
  const { question_text, question_type, is_required, options } = req.body;
  const userId = req.user.id;

  if (!question_text || !question_type) {
    return res
      .status(400)
      .json({ error: "Question text and type are required" });
  }

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

    // Get current max order
    const { data: existingQuestions } = await supabase
      .from("questions")
      .select("order_index")
      .eq("form_id", formId)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrder =
      existingQuestions && existingQuestions.length > 0
        ? existingQuestions[0].order_index + 1
        : 0;

    // Insert question
    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({
        form_id: formId,
        question_text,
        question_type,
        is_required: is_required || false,
        order_index: nextOrder,
      })
      .select()
      .single();

    if (questionError) throw questionError;

    // Add options if provided (for multiple_choice, checkboxes, dropdown)
    if (options && Array.isArray(options) && options.length > 0) {
      const optionsToInsert = options.map((opt, index) => ({
        question_id: question.id,
        option_text: opt,
        order_index: index,
      }));

      const { error: optionsError } = await supabase
        .from("options")
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;
    }

    return res.status(201).json({
      message: "Question added successfully",
      question,
    });
  } catch (err) {
    console.error("Add question error:", err);
    return res.status(500).json({ error: "Failed to add question" });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { question_text, question_type, is_required } = req.body;
  const userId = req.user.id;

  try {
    // Check if user owns the form
    const { data: question } = await supabase
      .from("questions")
      .select("form_id, forms!inner(created_by)")
      .eq("id", questionId)
      .single();

    if (!question || question.forms.created_by !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("questions")
      .update({ question_text, question_type, is_required })
      .eq("id", questionId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: "Question updated successfully",
      question: data,
    });
  } catch (err) {
    console.error("Update question error:", err);
    return res.status(500).json({ error: "Failed to update question" });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  const { questionId } = req.params;
  const userId = req.user.id;

  try {
    // Check if user owns the form
    const { data: question } = await supabase
      .from("questions")
      .select("form_id, forms!inner(created_by)")
      .eq("id", questionId)
      .single();

    if (!question || question.forms.created_by !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) throw error;

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Delete question error:", err);
    return res.status(500).json({ error: "Failed to delete question" });
  }
};
