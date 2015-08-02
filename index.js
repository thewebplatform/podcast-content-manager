var fs = require("fs"),
    clc = require('cli-color'),
    jsonfile = require('jsonfile'),
    util = require('util'),
    waveform = require('waveform');

var EPISODE_DIR = 'episodes';

var colors = {
    error: clc.red,
    notice: clc.blue,
    warn: clc.yellow,
    info: clc.cyan,
    success: clc.green
};

/*
 * Reads a directory for files
 */
function readDirectory(dir, readFileCallback) {
    process.stdout.write(clc.erase.screen);
    console.log(colors.info("Reading Directory '" +
        colors.notice(dir) +
        "' for episodes"));
    spacer();

    // start reading the directory
    fs.readdir(dir, function(err, files) {
        console.log(colors.notice("\nFile Names Obtained : "));
        console.log(colors.success(files));
        spacer();
        readFileCallback(dir, files);
    });
}

function readAndProcessFiles(dir, files) {
    console.log(colors.info("\n\nProcessing Episodes"));
    spacer();

    var numOfFilesReady = 0;
    files.forEach(function(filename, index) {
        var fileData = jsonfile.readFileSync(dir + '/' + filename);
        if (validateJSONFile(dir, fileData, filename)) {
            numOfFilesReady++;
        }
    });
    if (numOfFilesReady == files.length) {
        contentInit();
    }
}

function validateJSONFile(dir, fileData, filename) {
    var isValid = true;
    console.log(colors.notice('Reading file for episode ' +
        colors.success(fileData.episode) +
        ' with episode title : ' +
        colors.success(fileData.title)));

    if (!fileData.localmp3) {
        console.log(colors.error("There is no mp3 associated with " +
            fileData.episode +
            " episode"));
    }

    if (fileData.datapoints) {
        console.log(colors.notice("This episode has valid data"));
    }

    if (fileData.localmp3 && !fileData.datapoints) {
        console.log(colors.warn("The episode does not have a waveform generated " +
            "for its mp3 file.\nStarting waveform generation " +
            "process in background.\nPlease be patient..."));
        generateWaveform(dir, fileData, filename);
        isValid = false;
    }
    spacer();
    return isValid;
}

/*
 *	Generates Waveform for a given file
 */
function generateWaveform(dir, fileData, filename) {
    waveform(dir + '/' + fileData.localmp3, {
        // waveform.js options
        waveformjs: '-', // path to output-file or - for stdout
        'wjs-width': 800, // width in samples
        'wjs-precision': 4, // how many digits of precision
        'wjs-plain': false
    }, function(err, output) {
        if (err) {
            console.log(colors.error(err));
        }
        if (output) {
            console.log(colors.success("Waveform generated for " +
                filename));
            appendWaveformToEpisode(dir + '/' + filename, output, fileData);
        }
    });
}

/*
 *	Appends Waveform data to the episode file
 */

function appendWaveformToEpisode(filename, output, fileData) {
    console.log(colors.notice("Adding waveform to episode file " +
        filename));
    fileData['datapoints'] = JSON.parse(output);
    jsonfile.writeFileSync(filename, fileData, {
        spaces: 2
    });
    console.log(colors.success(filename + ' now has all the data points for mp3.'));
    spacer();
    contentInit();
}

/*
 * Initializes Content file creation process
 */
function contentInit() {
    fs.readdir(EPISODE_DIR, function(err, files) {
        var filesWithDataPoints = 0;
        files.forEach(function(filename, index) {
            var fileData = jsonfile.readFileSync(EPISODE_DIR + '/' + filename);
            if (fileData.datapoints) {
                filesWithDataPoints++;
            }
        });
        if (filesWithDataPoints == files.length) {
            console.log(colors.info("\n\nAll checks complete.\nStarting content creation process"));
            spacer();
            createContentFile();
        }
    });
}

function createContentFile() {
    fs.readdir(EPISODE_DIR, function(err, files) {
        var finalContent = [];
        console.log(colors.notice("Merging File Data"));
        files.forEach(function(filename, index) {
            var fileData = jsonfile.readFileSync(EPISODE_DIR + '/' + filename);
            finalContent.push(fileData);
        });
        console.log(colors.notice("Creating content file"));
        jsonfile.writeFileSync('content.json', finalContent, {
            spaces: 2
        });
        console.log(colors.success("Content file is complete\nPlease see " +
            colors.notice("content.json") +
            " file."));
    });
}

/*
 * Adds a spacer line
 */
function spacer() {
    console.log(colors.warn("=================================================="));
}

readDirectory(EPISODE_DIR, readAndProcessFiles);