package domain

import org.scalatest.FunSuite

class ArticleTest extends FunSuite {

  test("testTrim") {
    val str = """大胆に捨てすぎて、毎日寒いです。
                |
                |
                |
                |そんなことは置いといて、""".stripMargin
    assert(Article.trim(str) === """大胆に捨てすぎて、毎日寒いです。そんなことは置いといて、""".stripMargin)
  }

}
