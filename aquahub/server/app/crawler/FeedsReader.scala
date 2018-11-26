package crawler

import java.net.URL

import com.rometools.rome.feed.synd.{SyndEntry, SyndFeed}
import com.rometools.rome.io.SyndFeedInput
import com.rometools.rome.io.XmlReader

import scala.collection.JavaConverters._

class FeedsReader {

  val RSS_FEED_URLS = List("http://aquaforest.tokyo/feed/")
  def read(): String = {
    // NOTE: code can throw exceptions
    val feedUrl = new URL("http://aquaforest.tokyo/feed/")
    val input = new SyndFeedInput
    val feed: SyndFeed = input.build(new XmlReader(feedUrl))
    println(feed)

//feed
//    // `feed.getEntries` has type `java.util.List[SyndEntry]`
//    val entries: Seq[SyndEntry] = asScalaBuffer(feed.getEntries).toVector
//    println(entries)
//
//    for (entry: SyndEntry <- entries) {
//      println("Title: " + entry.getTitle)
//      println("URI:   " + entry.getUri)
//      println("Date:  " + entry.getUpdatedDate)
//
//      // java.util.List[SyndLink]
//      val links = asScalaBuffer(entry.getLinks).toVector
//      for (link <- links) {
//        println("Link: " + link.getHref)
//      }
//
//      val contents = asScalaBuffer(entry.getContents).toVector
//      for (content <- contents) {
//        println("Content: " + content.getValue)
//      }
//
//      val categories = asScalaBuffer(entry.getCategories).toVector
//      for (category <- categories) {
//        println("Category: " + category.getName)
//      }
//
//      println("")
    ""
//    }
  }


  def aquaforest(): Unit = {

  }
}
