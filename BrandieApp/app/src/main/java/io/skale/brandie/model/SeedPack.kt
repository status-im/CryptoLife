package io.skale.brandie.model;

import com.google.gson.annotations.SerializedName
import io.skale.brandie.R


data class SeedPack(
        @SerializedName("id") private val _id: Int?,
        @SerializedName("name") private val _name: String? = "",
        @SerializedName("initials") private val _initials: String? = "",
        @SerializedName("color") private val _color: Int?
) {
    val id
        get() = _id ?: throw IllegalArgumentException("id is required")
    val name
        get() = _name ?: ""
    val initials
        get() = _initials ?: ""
    val color
        get() = _color ?: R.color.md_grey_300

    init {
        this.name
    }
}