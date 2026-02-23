package com.gramora.app

import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class SignupActivity : AppCompatActivity(), TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = null
    private var ambientPlayer: MediaPlayer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)

        val nameInput = findViewById<EditText>(R.id.nameInput)
        val emailInput = findViewById<EditText>(R.id.emailInput)
        val passwordInput = findViewById<EditText>(R.id.passwordInput)
        val confirmPasswordInput = findViewById<EditText>(R.id.confirmPasswordInput)
        val signupButton = findViewById<Button>(R.id.signupButton)
        val loginLink = findViewById<TextView>(R.id.loginLink)

        tts = TextToSpeech(this, this)

        ambientPlayer = MediaPlayer.create(this, R.raw.ambient_loop)
        ambientPlayer?.isLooping = true
        ambientPlayer?.setVolume(0.2f, 0.2f)
        ambientPlayer?.start()

        signupButton.setOnClickListener {
            val name = nameInput.text.toString().trim()
            val email = emailInput.text.toString().trim()
            val password = passwordInput.text.toString().trim()
            val confirmPassword = confirmPasswordInput.text.toString().trim()

            if (name.isNotEmpty() && email.isNotEmpty() && password.isNotEmpty()) {
                if (password == confirmPassword) {
                    speak("Account created successfully. Redirecting to your dashboard.")
                    Toast.makeText(this, "Signup successful!", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this, DashboardActivity::class.java))
                    finish()
                } else {
                    speak("Passwords do not match. Please re-enter them.")
                }
            } else {
                speak("Please fill in all the required fields.")
            }
        }

        loginLink.setOnClickListener {
            speak("Returning to the main page.")
            startActivity(Intent(this, MainActivity::class.java))
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            speak("Welcome! Create an account to join Gramora.")
        } else {
            Log.e("TTS", "Initialization failed")
        }
    }

    private fun speak(text: String) {
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "")
    }

    override fun onDestroy() {
        super.onDestroy()
        tts?.stop()
        tts?.shutdown()
        ambientPlayer?.stop()
        ambientPlayer?.release()
    }
}