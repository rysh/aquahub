import com.rysh.aquahub.shared.SharedMessages
import org.scalajs.dom

object ScalaJSExample {

  def main(args: Array[String]): Unit = {
    Option(dom.document.getElementById("scalajsShoutOut")).foreach(_.textContent = SharedMessages.itWorks)
  }
}
