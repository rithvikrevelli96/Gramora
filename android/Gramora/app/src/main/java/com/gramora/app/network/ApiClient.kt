package com.gramora.app.network

import android.content.Context
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    private const val BASE_URL = "http://192.168.1.112:5002/"

    private var retrofit: Retrofit? = null

    fun getClient(context: Context): Retrofit {
        var localRetrofit = retrofit
        if (localRetrofit == null) {
            synchronized(this) {
                localRetrofit = retrofit
                if (localRetrofit == null) {
                    val client = OkHttpClient.Builder()
                        .connectTimeout(30, TimeUnit.SECONDS)
                        .readTimeout(30, TimeUnit.SECONDS)
                        .writeTimeout(30, TimeUnit.SECONDS)
                        .addInterceptor { chain ->
                            val original = chain.request()

                            val prefs = context.getSharedPreferences("GramoraPrefs", Context.MODE_PRIVATE)
                            val token = prefs.getString("auth_token", "")

                            val requestBuilder = original.newBuilder()
                            if (!token.isNullOrEmpty()) {
                                requestBuilder.header("Authorization", "Bearer $token")
                            }

                            val request = requestBuilder
                                .method(original.method, original.body)
                                .build()

                            chain.proceed(request)
                        }
                        .build()

                    localRetrofit = Retrofit.Builder()
                        .baseUrl(BASE_URL)
                        .addConverterFactory(GsonConverterFactory.create())
                        .client(client)
                        .build()
                    retrofit = localRetrofit
                }
            }
        }
        return localRetrofit!!
    }
}
