import com.rysh.aquahub.shared.SharedMessages
import org.scalajs.dom.document
import org.scalajs.dom.raw.{Element, HTMLElement, HTMLImageElement}

object ScalaJSExample {

  def main(args: Array[String]): Unit = {
    Option(document.getElementById("top_image"))
      .map(_.asInstanceOf[HTMLImageElement])
      .foreach(image => image.onload = _ => clipTopImage(image))
    val nodeList = document.getElementsByName("list_image")
    (0 until nodeList.length).map(nodeList.item(_).asInstanceOf[HTMLImageElement]).foreach(image => image.onload = _ => clipListImage(image))
  }

  private def clipTopImage(image: HTMLImageElement): Unit = {
    val container   = document.getElementById("image_container").asInstanceOf[HTMLElement]
    val clientWidth = container.parentElement.clientWidth
    image.style = ClipTopImage.clip(image.naturalHeight, image.naturalWidth, clientWidth)
    container.style = s"height: ${ClipTopImage.gHeight(clientWidth)}px;position: relative;"
  }

  private def clipListImage(image: HTMLImageElement): Unit = {
    val clientWidth = document.getElementById("main").clientWidth / 5

    image.width = clientWidth
    image.height = ClipTopImage.gHeight(clientWidth)
    image.style = "display: block;"
  }
}
