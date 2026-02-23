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

class LoginActivity : AppCompatActivity(), TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = null
    private var ambientPlayer: MediaPlayer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val emailInput = findViewById<EditText>(R.id.emailInput)
        val passwordInput = findViewById<EditText>(R.id.passwordInput)
        val loginButton = findViewById<Button>(R.id.loginButton)
        val signupLink = findViewById<TextView>(R.id.signupLink)

        tts = TextToSpeech(this, this)

        ambientPlayer = MediaPlayer.create(this, R.raw.ambient_loop)
        ambientPlayer?.isLooping = true
        ambientPlayer?.setVolume(0.2f, 0.2f)
        ambientPlayer?.start()

        loginButton.setOnClickListener {
            val email = emailInput.text.toString().trim()
            val password = passwordInput.text.toString().trim()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                speak("Login successful. Redirecting to your dashboard.")
                Toast.makeText(this, "Login successful!", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, DashboardActivity::class.java))
                finish()
            } else {
                speak("Please enter both your email and password.")
            }
        }

        signupLink.setOnClickListener {
            speak("Navigating to the signup page.")
            startActivity(Intent(this, SignupActivity::class.java))
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            speak("Welcome back to Gramora. Please log in to continue.")
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