package domain

class Article(val model: models.Article) {
  def normalizeBody(): models.Article = model.copy(body = Article.trim(model.body))

}
object Article {

  def trim(a: String): String = {
    a.replaceAll("[ 　]*", "")
      .replaceAll("""(\r\n|\n|\r)""", "")
  }
}
