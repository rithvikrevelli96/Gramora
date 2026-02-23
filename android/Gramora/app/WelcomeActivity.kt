package com.gramora.app

import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class WelcomeActivity : AppCompatActivity() {
    private lateinit var tts: TextToSpeech
    private lateinit var ambientPlayer: MediaPlayer

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_welcome)

        // Voice greeting
        tts = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts.language = Locale.US
                tts.speak(
                    "Welcome to Gramora. Sign up or login to create your content with AI assistance.",
                    TextToSpeech.QUEUE_FLUSH, null, "welcomeId"
                )
            }
        }

        // Ambient sound
        ambientPlayer = MediaPlayer.create(this, R.raw.ambient_loop)
        ambientPlayer.isLooping = true
        ambientPlayer.setVolume(0.2f, 0.2f)
        ambientPlayer.start()

        // Animate logo
        val logo = findViewById<ImageView>(R.id.logoImage)
        logo.alpha = 0f
        logo.scaleX = 0.8f
        logo.scaleY = 0.8f
        logo.animate().alpha(1f).scaleX(1f).scaleY(1f).setDuration(1000).start()

        // Button click
        findViewById<Button>(R.id.loginButton).setOnClickListener {
            tts.speak("Login", TextToSpeech.QUEUE_FLUSH, null, "loginId")
            startActivity(Intent(this, LoginActivity::class.java))
        }

        findViewById<Button>(R.id.signupButton).setOnClickListener {
            tts.speak("Sign up", TextToSpeech.QUEUE_FLUSH, null, "signupId")
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