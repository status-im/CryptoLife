package io.skale.brandie.util;

import android.content.pm.PackageManager
import io.skale.brandie.R
import io.skale.brandie.model.SeedPack
import io.skale.brandie.model.Token
import java.util.*


class Utils {

    companion object {

        val TWITTER_PACKAGE_NAME = "com.twitter.android"
        val FACEBOOK_PACKAGE_NAME = "com.facebook.katana"

        fun generateTokensMock(): ArrayList<Token> {

            val tokens = ArrayList<Token>()

            tokens.add(Token(1, "JAMESON", "jameson_bg",
                    "https://firebasestorage.googleapis.com/v0/b/maphon-token.appspot.com/o/jameson.png?alt=media&token=38e256cd-9366-40a4-a81d-991222fb8925", "LEVEL 2", "1 of 10,000"))

            tokens.add(Token(2, "CORONA", "corona_bg",
                    "https://firebasestorage.googleapis.com/v0/b/maphon-token.appspot.com/o/corona.png?alt=media&token=f8f28c54-f762-4756-87b4-f577e96ab8cb", "LEVEL 4", "1 of 1,000"));

            tokens.add(Token(3, "DELTA", "delta_bg",
                    "https://firebasestorage.googleapis.com/v0/b/maphon-token.appspot.com/o/delta.png?alt=media&token=1a52f2ac-b71f-4cfd-bac5-55b7324c5021", "LEVEL 1", "1 of 10,000"));

            tokens.add(Token(4, "IN-N-OUT", "innout_bg",
                    "https://firebasestorage.googleapis.com/v0/b/maphon-token.appspot.com/o/innout.jpg?alt=media&token=1846c21b-6823-43af-b3e4-e105610b6fec", "LEVEL 6", "1 of 100"));

            tokens.add(Token(5, "STARBUCKS", "starbucks_bg",
                    "https://firebasestorage.googleapis.com/v0/b/maphon-token.appspot.com/o/starbucks.jpg?alt=media&token=fe3dcdc4-27fc-4403-ba6b-595cbebe871a", "LEVEL 6", "1 of 100"));

            tokens.add(Token(6, "BURGER KING", "burgerking_bg",
                    "https://firebasestorage.googleapis.com/v0/b/maphon-token.appspot.com/o/burgerking.jpeg?alt=media&token=586a9c3e-ef1b-4331-83cd-498510cb1e85", "LEVEL 6", "1 of 100"));

            tokens.add(Token(7, "SONY", "sony_bg",
                    "https://firebasestorage.googleapis.com/v0/b/maphon-token.appspot.com/o/sony.png?alt=media&token=489a9fe7-cbcb-4589-a538-ab8ddcd82203", "LEVEL 6", "1 of 100"));

            return tokens
        }

        fun getRandomToken(): Token {
            val tokens = generateTokensMock()
            val random = Random().nextInt(tokens.size - 1)
            return tokens[random]
        }

        fun generateSeedPacksMock(): ArrayList<SeedPack> {

            val seedPacks = ArrayList<SeedPack>()
            seedPacks.add(SeedPack(1, "TOKEN \nCOLLECTIVE", "TC", R.color.md_amber_300))
            seedPacks.add(SeedPack(2, "TOKEN \nCOLLECTIVE", "TC", R.color.md_red_300))
            seedPacks.add(SeedPack(3, "TOKEN \nCOLLECTIVE", "TC", R.color.md_green_300))
            seedPacks.add(SeedPack(4, "TOKEN \nCOLLECTIVE", "TC", R.color.md_blue_300))
            seedPacks.add(SeedPack(5, "TOKEN \nCOLLECTIVE", "TC", R.color.md_yellow_300))
            seedPacks.add(SeedPack(6, "TOKEN \nCOLLECTIVE", "TC", R.color.md_indigo_300))

            return seedPacks;
        }

        fun isFacebookInstalled(packageManager: PackageManager): Boolean {
            return isPackageInstalled(FACEBOOK_PACKAGE_NAME, packageManager)
        }

        fun isTwitterInstalled(packageManager: PackageManager): Boolean {
            return isPackageInstalled(TWITTER_PACKAGE_NAME, packageManager)
        }

        private fun isPackageInstalled(packageName: String, packageManager: PackageManager): Boolean {
            return try {
                packageManager.getPackageInfo(packageName, 0)
                true
            } catch (e: PackageManager.NameNotFoundException) {
                false
            }
        }

    }

}
