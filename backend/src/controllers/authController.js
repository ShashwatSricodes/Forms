// backend/src/controllers/authController.js
import supabase from "../../supabaseClient.js";

// Controller for handling user sign-up
export const signup = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required.",
    });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Signup error:", error);
      return res.status(400).json({
        error: error.message,
        details: error.name,
      });
    }

    // Check if user is auto-confirmed (if email confirmation is turned off in Supabase)
    if (data.user && data.session) {
      return res.status(201).json({
        message: "Signup successful! You are now logged in.",
        user: data.user.email,
        token: data.session.access_token,
        session: true,
      });
    }
    // Check if confirmation email was sent (if email confirmation is turned on)
    else if (data.user && !data.session) {
      return res.status(202).json({
        message:
          "Signup successful! Please check your email to confirm your account.",
        user: data.user.email,
      });
    } else {
      return res.status(500).json({
        error: "An unexpected server response was received.",
      });
    }
  } catch (err) {
    console.error("Server error during signup:", err);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

// Controller for handling user login (sign-in)
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required.",
    });
  }

  try {
    // Use signInWithPassword for traditional email/password login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Login error:", error);
      // Supabase returns errors for invalid credentials (user not found, wrong password)
      return res.status(401).json({
        error: "Invalid credentials.",
        details: error.message,
      });
    }

    // Successful sign-in
    if (data.user && data.session) {
      return res.status(200).json({
        message: "Login successful!",
        user: data.user.email,
        token: data.session.access_token,
        session: true,
      });
    } else {
      // Fallback for unexpected API response
      return res.status(500).json({
        error: "An unexpected server response was received during login.",
      });
    }
  } catch (err) {
    console.error("Server error during login:", err);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};
