// backend/src/controllers/authController.js
import supabase from "../../supabaseClient.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data.user && data.session) {
      return res.status(201).json({
        message: "Signup successful!",
        user: data.user.email,
        token: data.session.access_token,
      });
    } else if (data.user && !data.session) {
      return res.status(202).json({
        message: "Please check your email to confirm your account.",
        user: data.user.email,
      });
    }
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (data.user && data.session) {
      return res.status(200).json({
        message: "Login successful!",
        user: data.user.email,
        token: data.session.access_token,
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
