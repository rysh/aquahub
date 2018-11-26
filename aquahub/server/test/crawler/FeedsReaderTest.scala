package crawler

import org.specs2.mutable.Specification

class FeedsReaderTest extends Specification {

  "FeedsReaderTest" should {
    "aquaforest" in {
      new FeedsReader().read() === ""
    }

  }
}
