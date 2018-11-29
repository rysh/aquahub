import sbtcrossproject.{CrossPlugin, CrossType}

lazy val server = (project in file("server"))
  .settings(commonSettings)
  .settings(
    scalaJSProjects := Seq(client),
    pipelineStages in Assets := Seq(scalaJSPipeline),
    pipelineStages := Seq(digest, gzip),
    // triggers scalaJSPipeline when using compile or continuous compilation
    compile in Compile := ((compile in Compile) dependsOn scalaJSPipeline).value,
    libraryDependencies ++= Seq(
      "com.vmunier"     %% "scalajs-scripts"              % "1.1.2",
      "org.scalikejdbc" %% "scalikejdbc"                  % "3.3.1",
      "org.scalikejdbc" %% "scalikejdbc-config"           % "3.3.1",
      "org.scalikejdbc" %% "scalikejdbc-test"             % "3.3.1" % "test",
      "org.scalikejdbc" %% "scalikejdbc-play-initializer" % "2.6.0-scalikejdbc-3.3",
      "mysql"           % "mysql-connector-java"          % "8.0.13",
      guice,
      specs2 % Test
    ),
    // Compile the project before generating Eclipse files, so that generated .scala or .class files for views and routes are present
    EclipseKeys.preTasks := Seq(compile in Compile)
  )
  .enablePlugins(PlayScala)
  .dependsOn(sharedJvm)

lazy val client = (project in file("client"))
  .settings(commonSettings)
  .settings(
    scalaJSUseMainModuleInitializer := true,
    libraryDependencies ++= Seq(
      "org.scala-js" %%% "scalajs-dom" % "0.9.6"
    )
  )
  .enablePlugins(ScalaJSPlugin, ScalaJSWeb)
  .dependsOn(sharedJs)

lazy val shared = CrossPlugin.autoImport
  .crossProject(JSPlatform, JVMPlatform)
  .crossType(CrossType.Pure)
  .in(file("shared"))
  .settings(commonSettings)
lazy val sharedJvm = shared.jvm
lazy val sharedJs  = shared.js

lazy val commonSettings = Seq(
  scalaVersion := "2.12.6",
  organization := "com.rysh"
)

// loads the server project at sbt startup
onLoad in Global := (onLoad in Global).value andThen { s: State =>
  "project server" :: s
}
