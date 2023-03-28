const karmaConfig = require('@eui/tools/karma/karma.conf');
const path = require('path');


module.exports = function (config) {
    const configuration = karmaConfig.get(config);
    configuration.plugins.push(require('karma-junit-reporter'),require('karma-coverage-istanbul-reporter'))
    configuration.coverageReporters = {
        includeAllSources : true
    }
    configuration.reporters.push( 'junit', 'coverage-istanbul');

    // the default configuration
    configuration.junitReporter = {
        outputDir: '../coverage/junit/', // results will be saved as $outputDir/$browserName.xml
        outputFile: 'junit-test-results.xml',
        useBrowserName: false,
    };

    configuration.coverageIstanbulReporter.thresholds = {
        emitWarning: false,
        global: {
            statements: 85.0,
            branches: 72.0,
            functions: 79.0,
            lines: 85.0
        }
    };

    configuration.coverageIstanbulReporter.dir = path.join(__dirname, '../coverage/coverage');
    configuration.coverageIstanbulReporter.reports = ['html', 'lcovonly', 'text-summary', 'cobertura'];
    configuration.coverageIstanbulReporter["report-config"] = {
        'text-summary': {
            file: 'text-summary.txt'
        }
    }

    config.set(
        configuration
    );
}
