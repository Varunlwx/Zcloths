package com.zeecloths.app.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.Date

@Parcelize
data class User(
    val id: Int = 0,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val phone: String? = null,
    val address: String? = null,
    val isAdmin: Boolean = false,
    val createdAt: Date = Date()
) : Parcelable