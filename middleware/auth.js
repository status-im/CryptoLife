export default function ({ route, store, redirect }) {
  if (!store.state.auth) {
    return redirect('/login')
  }
}
