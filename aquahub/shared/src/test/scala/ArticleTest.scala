import org.scalatest.FunSuite

class ArticleTest extends FunSuite {

  test("testTrim") {
    val str = """""".stripMargin
    assert("" === """""".stripMargin)
  }

}
