package io.skale.brandie.token.adapter

import android.content.Context
import android.content.Intent
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import com.bumptech.glide.Glide
import io.skale.brandie.R
import io.skale.brandie.model.Token
import io.skale.brandie.token.ui.TokenDetailsActivity
import kotlinx.android.synthetic.main.item_token.view.*

class TokenListAdapter(private val items: ArrayList<Token>, private val context: Context) : RecyclerView.Adapter<TokenListViewHolder>() {

    override fun getItemCount(): Int {
        return items.size
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TokenListViewHolder {
        return TokenListViewHolder(LayoutInflater.from(context).inflate(R.layout.item_token, parent, false))
    }

    override fun onBindViewHolder(holder: TokenListViewHolder, position: Int) {
        val token = items[position]

        holder?.tvTitle?.text = token.name
        holder?.tvLevel?.text = token.level
        holder?.tvAmount?.text = token.amount

        Glide.with(context).load(token.logo).into(holder?.imgLogo)

        holder?.itemView.setOnClickListener {
            val intent = Intent(context, TokenDetailsActivity::class.java)
            intent.putExtra(TokenDetailsActivity.TOKEN_PARCELABLE, token)
            context.startActivity(intent)
        }
    }
}

class TokenListViewHolder(view: View) : RecyclerView.ViewHolder(view) {
    val imgLogo: ImageView = view.img_token
    val tvTitle: TextView = view.tv_title
    val tvLevel: TextView = view.tv_level
    val tvAmount: TextView = view.tv_amount
}
