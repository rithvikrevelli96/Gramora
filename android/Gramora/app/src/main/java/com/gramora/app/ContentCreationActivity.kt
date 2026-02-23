package com.gramora.app

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.gramora.app.data.CaptionRequest
import com.gramora.app.data.CaptionResponse
import com.gramora.app.data.HashtagResponse
import com.gramora.app.network.ApiService
import com.gramora.app.network.RetrofitInstance
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*

class ContentCreationActivity : AppCompatActivity() {

    private lateinit var ideaInput: EditText
    private lateinit var segmentSelect: Spinner
    private lateinit var captionDisplay: TextView
    private lateinit var hashtagDisplay: TextView
    private lateinit var captionListLayout: LinearLayout
    private lateinit var generateCaptionBtn: Button
    private lateinit var generateHashtagBtn: Button

    private lateinit var apiService: ApiService
    private var tts: TextToSpeech? = null

    companion object {
        private const val TAG = "ContentCreationActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_content_creation)

        // Retrofit
        apiService = RetrofitInstance.api

        // Views
        ideaInput = findViewById(R.id.ideaInput)
        segmentSelect = findViewById(R.id.segmentSelect)
        captionDisplay = findViewById(R.id.captionDisplay)
        hashtagDisplay = findViewById(R.id.hashtagDisplay)
        captionListLayout = findViewById(R.id.captionList)
        generateCaptionBtn = findViewById(R.id.generateCaptionBtn)
        generateHashtagBtn = findViewById(R.id.generateHashtagBtn)

        // Segments
        val segments = listOf("Fashion", "Tech", "Sustainability", "Travel", "Food", "General")
        val segmentAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, segments)
        segmentAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        segmentSelect.adapter = segmentAdapter

        // TTS
        tts = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts?.language = Locale.US
            }
        }

        // ✅ Generate Caption
        generateCaptionBtn.setOnClickListener {
            val idea = ideaInput.text.toString().trim()
            if (idea.isEmpty()) {
                Toast.makeText(this, "Please enter an idea first", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val segment = segmentSelect.selectedItem?.toString() ?: "General"
            val request = CaptionRequest(idea, segment)

            Log.d(TAG, "Sending caption request: $request")

            apiService.generateCaption(request).enqueue(object : Callback<CaptionResponse> {
                override fun onResponse(call: Call<CaptionResponse>, response: Response<CaptionResponse>) {
                    if (response.isSuccessful && response.body() != null) {
                        val captions = response.body()!!.captions
                        val caption = captions.firstOrNull() ?: "No caption generated"
                        captionDisplay.text = caption

                        captionListLayout.removeAllViews()
                        captions.forEach {
                            val tv = TextView(this@ContentCreationActivity).apply {
                                text = it
                                setTextColor(getColor(android.R.color.black))
                                textSize = 14f
                                setPadding(8, 8, 8, 8)
                            }
                            captionListLayout.addView(tv)
                        }

                        tts?.speak("Generated caption: $caption", TextToSpeech.QUEUE_FLUSH, null, null)
                        Toast.makeText(this@ContentCreationActivity, "Caption generated", Toast.LENGTH_SHORT).show()
                    } else {
                        Log.e(TAG, "Caption API failed: ${response.code()} - ${response.errorBody()?.string()}")
                        Toast.makeText(this@ContentCreationActivity, "Failed to generate caption (code ${response.code()})", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<CaptionResponse>, t: Throwable) {
                    Log.e(TAG, "Caption API error: ${t.message}", t)
                    Toast.makeText(this@ContentCreationActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
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
                        Toast.makeText(this@ContentCreationActivity, "Hashtags generated", Toast.LENGTH_SHORT).show()
                    } else {
                        Log.e(TAG, "Hashtag API failed: ${response.code()} - ${response.errorBody()?.string()}")
                        Toast.makeText(this@ContentCreationActivity, "Failed to generate hashtags (code ${response.code()})", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<HashtagResponse>, t: Throwable) {
                    Log.e(TAG, "Hashtag API error: ${t.message}", t)
                    Toast.makeText(this@ContentCreationActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        tts?.stop()
        tts?.shutdown()
    }
}