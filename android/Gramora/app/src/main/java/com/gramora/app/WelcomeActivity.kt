package com.gramora.app

import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class WelcomeActivity : AppCompatActivity() {
    private var tts: TextToSpeech? = null
    private var ambientPlayer: MediaPlayer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        try {
            setContentView(R.layout.activity_welcome)
            Toast.makeText(this, "WelcomeActivity loaded", Toast.LENGTH_SHORT).show()

            // ✅ Voice greeting
            tts = TextToSpeech(this) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    tts?.language = Locale.US
                    tts?.speak("Welcome to Gramora. Power your posts with AI.", TextToSpeech.QUEUE_FLUSH, null)
                }
            }

            // ✅ Ambient loop
            try {
                ambientPlayer = MediaPlayer.create(this, R.raw.ambient_loop)
                ambientPlayer?.isLooping = true
                ambientPlayer?.setVolume(0.2f, 0.2f)
                ambientPlayer?.start()
            } catch (e: Exception) {
                Toast.makeText(this, "Ambient sound failed: ${e.message}", Toast.LENGTH_SHORT).show()
            }

            // ✅ Navigation buttons
            val loginButton = findViewById<Button>(R.id.loginButton)
            val signupButton = findViewById<Button>(R.id.signupButton)

            loginButton.setOnClickListener {
                Toast.makeText(this, "Navigating to LoginActivity", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, LoginActivity::class.java))
            }

            signupButton.setOnClickListener {
                Toast.makeText(this, "Navigating to SignupActivity", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, SignupActivity::class.java))
            }

        } catch (e: Exception) {
            Toast.makeText(this, "WelcomeActivity crashed: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        tts?.stop()
        tts?.shutdown()
        ambientPlayer?.stop()
        ambientPlayer?.release()
    }
}