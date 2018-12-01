package repository

import models.Article
import models.Article.{a, autoSession}
import scalikejdbc._

object ArticleRepository {

  def list()(implicit session: DBSession = autoSession): List[Article] = {
    withSQL {
      select.from(Article as a).orderBy(a.publishDatetime).desc.limit(30)
    }.map(Article(a.resultName)).list.apply()
  }

}
