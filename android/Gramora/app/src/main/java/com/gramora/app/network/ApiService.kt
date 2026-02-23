package com.gramora.app.network

import com.gramora.app.data.CaptionRequest
import com.gramora.app.data.CaptionResponse
import com.gramora.app.data.HashtagResponse
import com.gramora.app.data.GramoraPost
import com.gramora.app.data.UploadResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    // 📝 Caption generation
    @POST("generateCaption")
    fun generateCaption(@Body request: CaptionRequest): Call<CaptionResponse>

    // 📝 Hashtag generation
    @POST("generateHashtag")
    fun generateHashtag(@Body request: CaptionRequest): Call<HashtagResponse>

    // 📤 Upload post
    @POST("upload")
    fun uploadPost(@Body post: GramoraPost): Call<UploadResponse>
}