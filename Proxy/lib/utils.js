var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

module.exports = {
    /* Gets all of the .js files in a directory recursively. Files can be ingored by their
     * first character if that character is passed into the ignorePrefixes
     * argument (string || array)
     */
    getModulesInDirectory: function (dirPath, ignorePrefixes) {
        var files = fs.readdirSync(dirPath),
            modules = [];
        _.each(files, function(file) {
            var filePath = path.join(dirPath, file),
                fileStat = fs.statSync(filePath);
            if (fileStat.isDirectory()) {
                modules = modules.concat(getFilesInDirectory(filePath, ignorePrefixes));
            } else {
                // Only include .js files and don't include files that start with "_"
                if (fileStat.isFile() &&
                    (ignorePrefixes === undefined || _.indexOf(ignorePrefixes, path.basename(file).charAt(0)) === -1) &&
                    path.extname(file) === '.js'
                ) {
                    modules.push(filePath);
                }
            }
        });
        return modules;
    }
};
