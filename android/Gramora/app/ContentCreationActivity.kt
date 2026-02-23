package com.gramora.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class ContentCreationActivity : AppCompatActivity() {
    private var imageUri: Uri? = null
    private lateinit var imagePreview: ImageView
    private lateinit var ideaInput: EditText
    private lateinit var outputBox: TextView
    private lateinit var loadingText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_content_creation)

        imagePreview = findViewById(R.id.imagePreview)
        ideaInput = findViewById(R.id.ideaInput)
        outputBox = findViewById(R.id.outputBox)
        loadingText = findViewById(R.id.loadingText)

        val importBtn = findViewById<Button>(R.id.importImageBtn)
        val captionBtn = findViewById<Button>(R.id.generateCaptionBtn)
        val hashtagBtn = findViewById<Button>(R.id.generateHashtagBtn)
        val uploadBtn = findViewById<Button>(R.id.uploadBtn)

        importBtn.setOnClickListener {
            val intent = Intent(Intent.ACTION_GET_CONTENT)
            intent.type = "image/*"
            startActivityForResult(intent, 101)
        }

        captionBtn.setOnClickListener {
            val idea = ideaInput.text.toString()
            if (idea.isEmpty() && imageUri == null) {
                Toast.makeText(this, "Please enter a prompt or import an image.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            loadingText.text = "⏳ Generating caption..."
            outputBox.text = "📦 Caption: Your AI-generated caption will appear here."
        }

        hashtagBtn.setOnClickListener {
            val idea = ideaInput.text.toString()
            if (idea.isEmpty() && imageUri == null) {
                Toast.makeText(this, "Please enter a prompt or import an image.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            loadingText.text = "⏳ Generating hashtags..."
            outputBox.text = "#AI #Generated #Hashtags #Gramora"
        }

        uploadBtn.setOnClickListener {
            Toast.makeText(this, "✅ Upload to Instagram triggered!", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 101 && resultCode == RESULT_OK) {
            imageUri = data?.data
            imagePreview.setImageURI(imageUri)
        }
    }
}