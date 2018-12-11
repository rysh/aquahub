import org.scalajs.dom.document
import org.scalajs.dom.raw.{Element, HTMLElement, HTMLImageElement}

object ScalaJSExample {

  def main(args: Array[String]): Unit = {
    Option(document.getElementById("top_image"))
      .map(_.asInstanceOf[HTMLImageElement])
      .foreach(image => image.onload = _ => clipTopImage(image))
  }

  private def clipTopImage(image: HTMLImageElement): Unit = {
    val container   = document.getElementById("image_container").asInstanceOf[HTMLElement]
    val clientWidth = container.parentElement.clientWidth
    image.style = ClipTopImage.clip(image.naturalHeight, image.naturalWidth, clientWidth)
    container.style = s"height: ${ClipTopImage.gHeight(clientWidth)}px;position: relative;"
  }
}
