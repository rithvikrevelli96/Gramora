package com.gramora.app

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val dashboardBtn = findViewById<Button>(R.id.dashboardBtn)
        dashboardBtn.setOnClickListener {
            startActivity(Intent(this, DashboardActivity::class.java))
        }

        val contentCreationBtn = findViewById<Button>(R.id.contentCreationBtn)
        contentCreationBtn.setOnClickListener {
            startActivity(Intent(this, ContentCreationActivity::class.java))
        }
    }
}