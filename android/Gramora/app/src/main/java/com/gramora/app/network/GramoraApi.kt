package com.gramora.app.network

import android.content.Context
import com.gramora.app.data.CaptionRequest
import com.gramora.app.data.CaptionResponse
import com.gramora.app.data.HashtagResponse
import com.gramora.app.data.GramoraPost
import com.gramora.app.data.UploadResponse
import retrofit2.Call

object GramoraApi {

    private fun getService(context: Context): ApiService {
        return ApiClient.getClient(context).create(ApiService::class.java)
    }

    fun generateCaption(context: Context, request: CaptionRequest): Call<CaptionResponse> {
        return getService(context).generateCaption(request)
    }

    fun generateHashtag(context: Context, request: CaptionRequest): Call<HashtagResponse> {
        return getService(context).generateHashtag(request)
    }

    fun uploadPost(context: Context, post: GramoraPost): Call<UploadResponse> {
        return getService(context).uploadPost(post)
    }
}