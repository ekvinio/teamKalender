/**
 * Created by dev-kevinvanrijmenant on 8/31/15.
 */
module.exports = function(grunt){
    grunt.initConfig({
        removelogging: {
            dist:{
                src:'./public/javascripts/ang/dev/*.js'
            }

        },
        clean:{
          build: {
              src : ['./public/javascripts/ang/mainCode.js']
          }
        },
        concat:{
            angular: {
                files:{
                    './public/javascripts/ang/mainCode.js':['./public/javascripts/ang/dev/*.js']
                }
            },
            doku : {
                files : {
                    './ALLDATA_JS.txt':['./public/javascripts/ang/tkMain.js','./public/javascripts/ang/dev/*.js','./routes/**/*.js','./Gruntfile.js','./cluster.js']
                }
            }

        },
        uglify: {
            allthatmatters:{
                options:{
                    sourceMap:true,
                    mangle: false
                },
                files :{
                    './public/javascripts/ang/mainCode.min.js':'./public/javascripts/ang/mainCode.js'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask('default',['removelogging','concat','uglify']);
    grunt.registerTask('cleanup',['clean']);

};
