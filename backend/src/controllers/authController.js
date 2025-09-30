// backend/src/controllers/authControllers.js
import supabase from "../../supabaseClient.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(400).json({
        error: error.message,
        details: error.name,
      });
    }

    if (data.user && data.session) {
      return res.status(201).json({
        message: "Signup successful! You are now logged in.",
        user: data.user.email,
        session: true,
      });
    } else if (data.user && !data.session) {
      return res.status(202).json({
        message:
          "Signup successful! Please check your email to confirm your account.",
        user: data.user.email,
      });
    } else {
      return res
        .status(500)
        .json({ error: "An unexpected server response was received." });
    }
  } catch (err) {
    console.error("Server error during signup:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
