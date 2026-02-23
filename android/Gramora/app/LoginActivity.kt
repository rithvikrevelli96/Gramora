package com.gramora.app

import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class LoginActivity : AppCompatActivity() {
    private lateinit var tts: TextToSpeech
    private lateinit var ambientPlayer: MediaPlayer

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        tts = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts.language = Locale.US
                tts.speak("Please login to continue your journey.", TextToSpeech.QUEUE_FLUSH, null)
            }
        }

        ambientPlayer = MediaPlayer.create(this, R.raw.ambient_loop)
        ambientPlayer.isLooping = true
        ambientPlayer.setVolume(0.2f, 0.2f)
        ambientPlayer.start()

        val emailInput = findViewById<EditText>(R.id.emailInput)
        val passwordInput = findViewById<EditText>(R.id.passwordInput)
        val loginButton = findViewById<Button>(R.id.loginButton)
        val signupLink = findViewById<TextView>(R.id.signupLink)

        loginButton.setOnClickListener {
            val email = emailInput.text.toString()
            val password = passwordInput.text.toString()
            if (email.isNotEmpty() && password.isNotEmpty()) {
                tts.speak("Logging you in now", TextToSpeech.QUEUE_FLUSH, null)
                startActivity(Intent(this, ContentCreationActivity::class.java))
            } else {
                tts.speak("Please enter both email and password", TextToSpeech.QUEUE_FLUSH, null)
            }
        }

        signupLink.setOnClickListener {
            tts.speak("Navigating to signup page", TextToSpeech.QUEUE_FLUSH, null)
            startActivity(Intent(this, SignupActivity::class.java))
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        tts.stop()
        tts.shutdown()
        ambientPlayer.stop()
        ambientPlayer.release()
    }
}