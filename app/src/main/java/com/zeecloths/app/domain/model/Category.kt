package com.zeecloths.app.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Category(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    val imageUrl: String? = null
) : Parcelable