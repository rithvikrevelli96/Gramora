package com.gramora.app

import android.content.Intent
import android.media.MediaPlayer
import android.net.Uri
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class DashboardActivity : AppCompatActivity() {
    private lateinit var tts: TextToSpeech
    private lateinit var ambientPlayer: MediaPlayer
    private var imageUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        tts = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts.language = Locale.US
                tts.speak("AI Activated. Let’s create something awesome.", TextToSpeech.QUEUE_FLUSH, null, "dashboardGreeting")
            }
        }

        ambientPlayer = MediaPlayer.create(this, R.raw.ambient_loop)
        ambientPlayer.isLooping = true
        ambientPlayer.setVolume(0.2f, 0.2f)
        ambientPlayer.start()

        val logo = findViewById<ImageView>(R.id.dashboardLogo)
        logo.alpha = 0f
        logo.scaleX = 0.8f
        logo.scaleY = 0.8f
        logo.animate().alpha(1f).scaleX(1f).scaleY(1f).setDuration(1000).start()

        val ideaInput = findViewById<EditText>(R.id.ideaInput)
        val imagePreview = findViewById<ImageView>(R.id.imagePreview)
        val captionSelect = findViewById<Spinner>(R.id.captionSelect)
        val generateCaptionBtn = findViewById<Button>(R.id.generateCaptionBtn)
        val generateHashtagBtn = findViewById<Button>(R.id.generateHashtagBtn)
        val uploadBtn = findViewById<Button>(R.id.uploadBtn)
        val imageImportBtn = findViewById<Button>(R.id.imageImportBtn)

        imageImportBtn.setOnClickListener {
            val intent = Intent(Intent.ACTION_GET_CONTENT)
            intent.type = "image/*"
            startActivityForResult(intent, 101)
        }

        generateCaptionBtn.setOnClickListener {
            tts.speak("Generating captions", TextToSpeech.QUEUE_FLUSH, null, "captionGen")
            Toast.makeText(this, "🧠 Caption generation placeholder", Toast.LENGTH_SHORT).show()
        }

        generateHashtagBtn.setOnClickListener {
            tts.speak("Generating hashtags", TextToSpeech.QUEUE_FLUSH, null, "hashtagGen")
            Toast.makeText(this, "🧠 Hashtag generation placeholder", Toast.LENGTH_SHORT).show()
        }

        uploadBtn.setOnClickListener {
            tts.speak("Redirecting to Instagram", TextToSpeech.QUEUE_FLUSH, null, "redirect")
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.instagram.com/"))
            startActivity(intent)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 101 && resultCode == RESULT_OK) {
            imageUri = data?.data
            val imagePreview = findViewById<ImageView>(R.id.imagePreview)
            imagePreview.setImageURI(imageUri)
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