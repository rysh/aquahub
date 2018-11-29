package service

import com.google.inject.AbstractModule
import play.api.Logger
import play.api.libs.concurrent.AkkaGuiceSupport

class Module extends AbstractModule with AkkaGuiceSupport {

  override def configure() = {
    Logger.info("Module.configure")
  }
}
