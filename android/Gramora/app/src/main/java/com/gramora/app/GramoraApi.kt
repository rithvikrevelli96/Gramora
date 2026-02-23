package com.gramora.app

import com.gramora.app.data.CaptionRequest
import com.gramora.app.data.CaptionResponse
import com.gramora.app.data.GramoraPost
import com.gramora.app.data.HashtagResponse
import com.gramora.app.data.UploadResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface GramoraApi {

    @POST("upload")
    fun uploadPost(@Body post: GramoraPost): Call<UploadResponse>

    @POST("generate")
    fun generateCaption(@Body request: CaptionRequest): Call<CaptionResponse>

    @POST("generateHashtag")
    fun generateHashtag(@Body request: CaptionRequest): Call<HashtagResponse>
}
