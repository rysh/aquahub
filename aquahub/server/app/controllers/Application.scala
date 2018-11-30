package controllers

import com.rysh.aquahub.shared.SharedMessages
import javax.inject._
import models.Article
import play.api.mvc._
import scalikejdbc._

@Singleton
class Application @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def index = Action {
    implicit val session: AutoSession.type = AutoSession
    val articles: Seq[Article]             = Article.findAll()
    println(articles)
    Ok(views.html.index(SharedMessages.itWorks, articles))
  }

  def article(id: String) = Action {
    implicit val session: AutoSession.type = AutoSession

    val maybeArticle: Option[Article] = Article.findBy(sqls" article_id = ${id} ")

    maybeArticle match {
      case Some(article) => Ok(views.html.article(article))
      case None          => NotFound
    }

  }
}
