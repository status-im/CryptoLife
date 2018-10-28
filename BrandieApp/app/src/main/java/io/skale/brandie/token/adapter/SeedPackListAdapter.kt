package io.skale.brandie.token.adapter

import android.content.Context
import android.support.v4.content.ContextCompat
import android.support.v7.widget.CardView
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import io.skale.brandie.R
import io.skale.brandie.model.SeedPack
import kotlinx.android.synthetic.main.item_seed_pack.view.*


class SeedPackListAdapter(private val items: ArrayList<SeedPack>, private val context: Context) : RecyclerView.Adapter<SeedPackViewHolder>() {

    override fun getItemCount(): Int {
        return items.size
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SeedPackViewHolder {
        return SeedPackViewHolder(LayoutInflater.from(context).inflate(R.layout.item_seed_pack, parent, false))
    }

    override fun onBindViewHolder(holder: SeedPackViewHolder, position: Int) {
        holder?.itemContainer.setCardBackgroundColor(ContextCompat.getColor(context, items[position].color))

        holder?.tvInitials?.text = items[position].initials
        holder?.tvName?.text = items[position].name
    }
}

class SeedPackViewHolder(view: View) : RecyclerView.ViewHolder(view) {
    val itemContainer : CardView = view.item_container

    val tvInitials : TextView = view.tv_initials
    val tvName : TextView = view.tv_name
}
