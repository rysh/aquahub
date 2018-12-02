object ClipTopImage {
  def clip(naturalHeight: Int, naturalWidth: Int, mainWidth: Int): String = {
    val height   = gHeight(mainWidth)
    val top: Int = (naturalHeight - height) / 2
    val bottom   = top + height
    val left     = (naturalWidth - mainWidth) / 2
    val right    = left + mainWidth
    s"clip:rect(${top}px,${right}px,${bottom}px,${left}px); position:absolute;margin-top: -${top}px;margin-left: -${left}px"
  }

  val goldenRatio              = 1.618
  def gWidth(height: Int): Int = (height * goldenRatio).toInt
  def gHeight(width: Int): Int = (width / goldenRatio).toInt
}
