import 'package:logger/logger.dart';

final Logger logger = Logger(
  printer: PrettyPrinter(
    methodCount: 0, // No method calls to be displayed
    errorMethodCount: 5, // Number of method calls if stacktrace is provided
    lineLength: 50, // Width of the output
    colors: true, // Colorful log messages
    printEmojis: true, // Print an emoji for each log message
    dateTimeFormat: DateTimeFormat.none, // Should each log message contain a timestamp
  ),
);