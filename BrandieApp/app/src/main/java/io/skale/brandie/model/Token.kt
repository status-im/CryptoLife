package io.skale.brandie.model

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.SerializedName


data class Token(
        @SerializedName("id") private val _id: Int?,
        @SerializedName("name") private val _name: String? = "",
        @SerializedName("image") private val _image: String? = "",
        @SerializedName("logo") private val _logo: String? = "",
        @SerializedName("level") private val _level: String? = "",
        @SerializedName("amount") private val _amount: String? = ""
) : Parcelable {
    val id
        get() = _id ?: throw IllegalArgumentException("id is required")
    val name
        get() = _name ?: ""
    val image
        get() = _image ?: ""
    val logo
        get() = _logo ?: ""
    val level
        get() = _level ?: ""
    val amount
        get() = _amount ?: ""

    constructor(parcel: Parcel) : this(
            parcel.readValue(Int::class.java.classLoader) as? Int,
            parcel.readString(),
            parcel.readString(),
            parcel.readString(),
            parcel.readString(),
            parcel.readString()) {
    }

    init {
        this.name
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeValue(_id)
        parcel.writeString(_name)
        parcel.writeString(_image)
        parcel.writeString(_logo)
        parcel.writeString(_level)
        parcel.writeString(_amount)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Token> {
        override fun createFromParcel(parcel: Parcel): Token {
            return Token(parcel)
        }

        override fun newArray(size: Int): Array<Token?> {
            return arrayOfNulls(size)
        }
    }
}