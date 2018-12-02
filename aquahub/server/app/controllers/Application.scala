package controllers

import com.rysh.aquahub.shared.SharedMessages
import javax.inject._
import domain.Article
import play.api.mvc._
import repository.ArticleRepository
import scalikejdbc._

@Singleton
class Application @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def index = Action {
    implicit val session: AutoSession.type = AutoSession
    Ok(views.html.index(SharedMessages.itWorks, ArticleRepository.list()))
  }

  def article(id: String) = Action {
    implicit val session: AutoSession.type = AutoSession

    val maybeArticle: Option[Article] = models.Article
      .findBy(sqls" article_id = ${id} ")
      .map(new Article(_))
    maybeArticle.map(a => a.normalizeBody()) match {
      case Some(article) => Ok(views.html.article(article))
      case None          => NotFound
    }

  }
}
