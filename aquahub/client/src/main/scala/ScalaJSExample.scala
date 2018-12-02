import com.rysh.aquahub.shared.SharedMessages
import org.scalajs.dom.document
import org.scalajs.dom.raw.{Element, HTMLElement, HTMLImageElement}

object ScalaJSExample {

  def main(args: Array[String]): Unit = {
    Option(document.getElementById("scalajsShoutOut")).foreach(_.textContent = SharedMessages.itWorks)
    Option(document.getElementById("top_image"))
      .map(_.asInstanceOf[HTMLImageElement])
      .foreach(image => image.onload = _ => clipTopImage(image))
  }

  private def clipTopImage(image: HTMLImageElement): Unit = {
    val clientWidth = document.getElementById("main").clientWidth
    val container   = document.getElementById("image_container").asInstanceOf[HTMLElement]
    image.style = ClipTopImage.clip(image.naturalHeight, image.naturalWidth, clientWidth)
    container.style = s"height: ${ClipTopImage.gHeight(clientWidth)}px;position: relative;"
  }
}
