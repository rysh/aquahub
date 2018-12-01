package models

import scalikejdbc._
import java.time.{ZonedDateTime}

case class Article(id: Long, articleId: String, url: String, imageUrl: Option[String] = None, title: String, body: String, publishDatetime: ZonedDateTime, forceUpdate: Boolean) {

  def save()(implicit session: DBSession = Article.autoSession): Article = Article.save(this)(session)

  def destroy()(implicit session: DBSession = Article.autoSession): Int = Article.destroy(this)(session)

}

object Article extends SQLSyntaxSupport[Article] {

  override val schemaName = Some("aquahub")

  override val tableName = "article"

  override val columns = Seq("id", "article_id", "url", "image_url", "title", "body", "publish_datetime", "force_update")

  def apply(a: SyntaxProvider[Article])(rs: WrappedResultSet): Article = apply(a.resultName)(rs)
  def apply(a: ResultName[Article])(rs: WrappedResultSet): Article = new Article(
    id = rs.get(a.id),
    articleId = rs.get(a.articleId),
    url = rs.get(a.url),
    imageUrl = rs.get(a.imageUrl),
    title = rs.get(a.title),
    body = rs.get(a.body),
    publishDatetime = rs.get(a.publishDatetime),
    forceUpdate = rs.get(a.forceUpdate)
  )

  val a = Article.syntax("a")

  override val autoSession = AutoSession

  def find(id: Long)(implicit session: DBSession = autoSession): Option[Article] = {
    withSQL {
      select.from(Article as a).where.eq(a.id, id)
    }.map(Article(a.resultName)).single.apply()
  }

  def findAll()(implicit session: DBSession = autoSession): List[Article] = {
    withSQL(select.from(Article as a)).map(Article(a.resultName)).list.apply()
  }

  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls.count).from(Article as a)).map(rs => rs.long(1)).single.apply().get
  }

  def findBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Option[Article] = {
    withSQL {
      select.from(Article as a).where.append(where)
    }.map(Article(a.resultName)).single.apply()
  }

  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Article] = {
    withSQL {
      select.from(Article as a).where.append(where)
    }.map(Article(a.resultName)).list.apply()
  }

  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL {
      select(sqls.count).from(Article as a).where.append(where)
    }.map(_.long(1)).single.apply().get
  }

  def create(articleId: String, url: String, imageUrl: Option[String] = None, title: String, body: String, publishDatetime: ZonedDateTime, forceUpdate: Boolean)(
      implicit session: DBSession = autoSession
  ): Article = {
    val generatedKey = withSQL {
      insert
        .into(Article)
        .namedValues(
          column.articleId       -> articleId,
          column.url             -> url,
          column.imageUrl        -> imageUrl,
          column.title           -> title,
          column.body            -> body,
          column.publishDatetime -> publishDatetime,
          column.forceUpdate     -> forceUpdate
        )
    }.updateAndReturnGeneratedKey.apply()

    Article(id = generatedKey, articleId = articleId, url = url, imageUrl = imageUrl, title = title, body = body, publishDatetime = publishDatetime, forceUpdate = forceUpdate)
  }

  def batchInsert(entities: collection.Seq[Article])(implicit session: DBSession = autoSession): List[Int] = {
    val params: collection.Seq[Seq[(Symbol, Any)]] = entities.map(
      entity =>
        Seq(
          'articleId       -> entity.articleId,
          'url             -> entity.url,
          'imageUrl        -> entity.imageUrl,
          'title           -> entity.title,
          'body            -> entity.body,
          'publishDatetime -> entity.publishDatetime,
          'forceUpdate     -> entity.forceUpdate
      )
    )
    SQL("""insert into article(
      article_id,
      url,
      image_url,
      title,
      body,
      publish_datetime,
      force_update
    ) values (
      {articleId},
      {url},
      {imageUrl},
      {title},
      {body},
      {publishDatetime},
      {forceUpdate}
    )""").batchByName(params: _*).apply[List]()
  }

  def save(entity: Article)(implicit session: DBSession = autoSession): Article = {
    withSQL {
      update(Article)
        .set(
          column.id              -> entity.id,
          column.articleId       -> entity.articleId,
          column.url             -> entity.url,
          column.imageUrl        -> entity.imageUrl,
          column.title           -> entity.title,
          column.body            -> entity.body,
          column.publishDatetime -> entity.publishDatetime,
          column.forceUpdate     -> entity.forceUpdate
        )
        .where
        .eq(column.id, entity.id)
    }.update.apply()
    entity
  }

  def destroy(entity: Article)(implicit session: DBSession = autoSession): Int = {
    withSQL { delete.from(Article).where.eq(column.id, entity.id) }.update.apply()
  }

}
