package com.gramora.app

import android.app.Activity
import android.content.Intent
import android.media.MediaPlayer
import android.net.Uri
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.util.Log
import android.view.View
import android.view.animation.AnimationUtils
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.gramora.app.data.CaptionRequest
import com.gramora.app.data.CaptionResponse
import com.gramora.app.data.GramoraPost
import com.gramora.app.data.HashtagResponse
import com.gramora.app.data.UploadResponse
import com.gramora.app.network.ApiService
import com.gramora.app.network.RetrofitInstance
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*

class DashboardActivity : AppCompatActivity() {
    private var tts: TextToSpeech? = null
    private var ambientPlayer: MediaPlayer? = null
    private lateinit var imagePreview: ImageView
    private lateinit var ideaInput: EditText
    private lateinit var segmentSelect: Spinner
    private lateinit var hashtagDisplay: TextView
    private lateinit var imageCaption: TextView
    private lateinit var captionListLayout: LinearLayout
    private var selectedCaption: String = ""
    private lateinit var apiService: ApiService

    companion object {
        private const val IMAGE_PICK_CODE = 1001
        private const val TAG = "DashboardActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        apiService = RetrofitInstance.api

        val dashboardCard = findViewById<View>(R.id.dashboardCard)
        val blendIn = AnimationUtils.loadAnimation(this, R.anim.blend_in)
        dashboardCard.startAnimation(blendIn)

        tts = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts?.language = Locale.US
                tts?.speak("Welcome to your dashboard. Let's create something amazing.", TextToSpeech.QUEUE_FLUSH, null, null)
            }
        }

        ambientPlayer = MediaPlayer.create(this, R.raw.ambient_loop)
        ambientPlayer?.isLooping = true
        ambientPlayer?.setVolume(0.2f, 0.2f)
        ambientPlayer?.start()

        ideaInput = findViewById(R.id.ideaInput)
        imagePreview = findViewById(R.id.imagePreview)
        segmentSelect = findViewById(R.id.segmentSelect)
        hashtagDisplay = findViewById(R.id.hashtagDisplay)
        imageCaption = findViewById(R.id.imageCaption)
        captionListLayout = findViewById(R.id.captionList)

        val imageImportBtn = findViewById<Button>(R.id.imageImportBtn)
        val generateCaptionBtn = findViewById<Button>(R.id.generateCaptionBtn)
        val generateHashtagBtn = findViewById<Button>(R.id.generateHashtagBtn)
        val uploadBtn = findViewById<Button>(R.id.uploadBtn)

        val segments = listOf("Fashion", "Tech", "Sustainability", "Travel", "Food", "General")
        val segmentAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, segments)
        segmentAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        segmentSelect.adapter = segmentAdapter

        imageImportBtn.setOnClickListener {
            tts?.speak("Opening your gallery", TextToSpeech.QUEUE_FLUSH, null, null)
            val intent = Intent(Intent.ACTION_PICK).apply { type = "image/*" }
            startActivityForResult(intent, IMAGE_PICK_CODE)
        }

        // ✅ Generate Caption
        generateCaptionBtn.setOnClickListener {
            Log.d(TAG, "Generate Caption button clicked")
            val idea = ideaInput.text.toString().trim()
            if (idea.isEmpty()) {
                Toast.makeText(this, "Please enter an idea first", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val segment = segmentSelect.selectedItem?.toString() ?: "General"
            val request = CaptionRequest(idea, segment)

            apiService.generateCaption(request).enqueue(object : Callback<CaptionResponse> {
                override fun onResponse(call: Call<CaptionResponse>, response: Response<CaptionResponse>) {
                    if (response.isSuccessful && response.body() != null) {
                        val captions = response.body()!!.captions
                        val caption = captions.firstOrNull() ?: "No caption generated"
                        imageCaption.text = caption
                        selectedCaption = caption

                        captionListLayout.removeAllViews()
                        captions.forEach {
                            val tv = TextView(this@DashboardActivity).apply {
                                text = it
                                setTextColor(getColor(android.R.color.white))
                                textSize = 14f
                                setPadding(8, 8, 8, 8)
                            }
                            captionListLayout.addView(tv)
                        }

                        tts?.speak("Generated caption: $caption", TextToSpeech.QUEUE_FLUSH, null, null)
                        Toast.makeText(this@DashboardActivity, "Caption generated", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this@DashboardActivity, "Failed to generate caption", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<CaptionResponse>, t: Throwable) {
                    Toast.makeText(this@DashboardActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }

        // ✅ Generate Hashtags
        generateHashtagBtn.setOnClickListener {
            val idea = ideaInput.text.toString().trim()
            if (idea.isEmpty()) {
                Toast.makeText(this, "Please enter an idea first", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val segment = segmentSelect.selectedItem?.toString() ?: "General"
            val request = CaptionRequest(idea, segment)

            apiService.generateHashtag(request).enqueue(object : Callback<HashtagResponse> {
                override fun onResponse(call: Call<HashtagResponse>, response: Response<HashtagResponse>) {
                    if (response.isSuccessful && response.body() != null) {
                        val hashtags = response.body()!!.hashtags.joinToString(" ")
                        hashtagDisplay.text = hashtags
                        hashtagDisplay.visibility = View.VISIBLE
                        tts?.speak("Generated hashtags: $hashtags", TextToSpeech.QUEUE_FLUSH, null, null)
                        Toast.makeText(this@DashboardActivity, "Hashtags generated", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this@DashboardActivity, "Failed to generate hashtags", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<HashtagResponse>, t: Throwable) {
                    Toast.makeText(this@DashboardActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }

        // ✅ Upload Post
        uploadBtn.setOnClickListener {
            val caption = if (selectedCaption.isNotEmpty()) selectedCaption else imageCaption.text.toString()
            val hashtags = hashtagDisplay.text.toString()
            val fullText = "$caption\n\n$hashtags"

            val imageUriString = imagePreview.tag?.toString()
            if (imageUriString.isNullOrEmpty()) {
                Toast.makeText(this, "Please select an image first", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val imageUri = Uri.parse(imageUriString)

            val post = GramoraPost(
                ideaInput.text.toString(),
                fullText,
                imageUri.toString()
            )

            uploadBtn.isEnabled = false
            apiService.uploadPost(post).enqueue(object : Callback<UploadResponse> {
                override fun onResponse(call: Call<UploadResponse>, response: Response<UploadResponse>) {
                    uploadBtn.isEnabled = true
                    if (response.isSuccessful && response.body()?.success == true) {
                        val msg = response.body()!!.message
                        Toast.makeText(this@DashboardActivity, msg, Toast.LENGTH_SHORT).show()
                        tts?.speak("Post uploaded successfully", TextToSpeech.QUEUE_FLUSH, null, null)
                    } else {
                        Toast.makeText(this@DashboardActivity, "Upload failed", Toast.LENGTH_SHORT).show()
                        tts?.speak("Upload failed", TextToSpeech.QUEUE_FLUSH, null, null)
                    }
                }

                override fun onFailure(call: Call<UploadResponse>, t: Throwable) {
                    uploadBtn.isEnabled = true
                    Toast.makeText(this@DashboardActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
                    tts?.speak("Network error. Try again.", TextToSpeech.QUEUE_FLUSH, null, null)
                }
            })

            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "image/*"
                putExtra(Intent.EXTRA_STREAM, imageUri)
                putExtra(Intent.EXTRA_TEXT, fullText)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }

            try {
                intent.setPackage("com.instagram.android")
                startActivity(intent)
                Toast.makeText(this, "Opening Instagram post editor...", Toast.LENGTH_LONG).show()
                tts?.speak("Opening Instagram with your post", TextToSpeech.QUEUE_FLUSH, null, null)
            } catch (e: android.content.ActivityNotFoundException) {
                intent.setPackage(null)
                startActivity(Intent.createChooser(intent, "Share via"))
                Toast.makeText(this, "Instagram not installed, using generic share", Toast.LENGTH_SHORT).show()
                tts?.speak("Instagram is not installed, using generic share", TextToSpeech.QUEUE_FLUSH, null, null)
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == IMAGE_PICK_CODE && resultCode == Activity.RESULT_OK) {
            val imageUri: Uri? = data?.data
            imagePreview.setImageURI(imageUri)
            imagePreview.tag = imageUri.toString()
            tts?.speak("Image imported successfully", TextToSpeech.QUEUE_FLUSH, null, null)
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