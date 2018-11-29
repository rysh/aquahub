package controllers

import com.rysh.aquahub.shared.SharedMessages
import javax.inject._
import models.Article
import play.api.mvc._
import scalikejdbc.AutoSession

@Singleton
class Application @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def index = Action {
    implicit val session: AutoSession.type = AutoSession
    println(Article.findAll())
    Ok(views.html.index(SharedMessages.itWorks))
  }

}
