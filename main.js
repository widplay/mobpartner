"use strict";

var API_URL = 'http://reportapiv2.mobpartner.mobi/report2.php',
    Q = require('q'),
    request = require('request');


/**
 * OBTENEMOS EL CONTENIDO DE LA API
 *
 * @param {String} url La url de la que obtener el codigo fuente
 */
function fileGetContents(url){

    var deferred = Q.defer();

    // La peticion
    request(url, function (error, response, body) {

        if(error){
            deferred.reject(error);
        }else if(response.statusCode == 200){
            deferred.resolve(body);
        }else{
            deferred.reject(new Error('Request Error: ' + url));
        }

    });

    return deferred.promise;

}

/**
 * CADENA A CAMELCASE
 *
 * @param {String} str La cadena a convertir
 */
function toCamelCase(str){
    return str.replace(/(?:_| |\b)(\w)/g, function(str, p1) {
        return p1.toUpperCase()
    });
}

/**
 * PARSEAMOS EL CSV
 *
 * @param {String} data El texto a parsear
 */
function parseCSV(data){

    var SEPARATOR_VALUE = ';',
        SEPARATOR_LINE = '<br />';

    // Los titulos de las cosas son la primera linea
    var lines = data.split(SEPARATOR_LINE),
        titles = lines.shift(),
        partsData,
        lineData,
        endData = [];

    // Torzeamos los titulos
    titles = titles.split(SEPARATOR_VALUE);
    titles = titles.map(toCamelCase);

    // Cada linea
    lines.forEach(function(line){
        if(line.length){
            partsData = line.split(SEPARATOR_VALUE);
            lineData = {};
            partsData.forEach(function(value, key){
                if(value.length){
                    lineData[titles[key]] = value;
                }
            });
            endData.push(lineData);
        }
    });

    return endData;

}

/**
 * CREAR LA URL MOBPARTNER A LA QUE LLAMAR
 *
 * @param {Object} getParams Los parametros get que se añaden a la peticion
 */
function createUrl(getParams){

    var url = API_URL + '?date_type=' + this.dateType + '&',
        keysParams = Object.keys(getParams);
    keysParams.forEach(function(key){
        url += key + '=' + getParams[key] + '&';
    });
    return url;
}

/**
 * OBTENER LAS ESTADÍSTICAS
 * @param {String} url La url de la que obtener el csv
 *
 * Date: '20140320',
 * Impressions: '0',
 * Clicks: '843',
 * ClicksBanner: '0',
 * ClicksText: '0',
 * ClicksOnly: '843',
 * CTR: '0',
 * Transactions: '156',
 * EarningsValidated: '91.46',
 * EarningsPending: '0',
 * CR: '17.67'
 */
function getResults(url){

    var deferred = Q.defer();

    // Obtenemos y parseamos
    fileGetContents(url)
        .then(parseCSV)
        .then(function(parsedData){
            deferred.resolve(parsedData);
        })
        .fail(function(err){
            deferred.reject(err);
        })
        .done();

    return deferred.promise;

}

/**
 * OBTNER LAS ESTADÍSTICAS DE UN PERIODO
 *
 * @param {String} period El intervalo del que sacar la fecha
 */
function getStatsOfPeriod(period){

    // Creamos la url
    var url = createUrl.call(this, {
        key: this.key,
        login: this.login,
        period: period,
        format: 'csv'
    });

    return getResults(url);

}

////////////////////////////////////////////////////////////////////////////////////

function MobPartner(key, login, dateType){

    dateType = (dateType) ? dateType : 'daily';

    this.key = key;
    this.login = login;
    this.dateType = dateType;
}

MobPartner.prototype.setDateType = function(dateType){
    dateType = (dateType === 'monthly' || dateType === 'daily') ? dateType : 'daily';
    this.dateType = dateType;
};

MobPartner.prototype.today = function(){
    return getStatsOfPeriod.call(this, 'today');
};
MobPartner.prototype.yesterday = function(){
    return getStatsOfPeriod.call(this, 'yesterday');
};
MobPartner.prototype.thisweek = function(){
    return getStatsOfPeriod.call(this, 'thisweek');
};
MobPartner.prototype.lastweek = function(){
    return getStatsOfPeriod.call(this, 'lastweek');
};
MobPartner.prototype.thismonth = function(){
    return getStatsOfPeriod.call(this, 'thismonth');
};
MobPartner.prototype.last7days = function(){
    return getStatsOfPeriod.call(this, 'last7days');
};
MobPartner.prototype.last30days = function(){
    return getStatsOfPeriod.call(this, 'last30days');
};
MobPartner.prototype.lastmonth = function(){
    return getStatsOfPeriod.call(this, 'lastmonth');
};
MobPartner.prototype.thisyear = function(){
    return getStatsOfPeriod.call(this, 'thisyear');
};
MobPartner.prototype.lastyear = function(){
    return getStatsOfPeriod.call(this, 'lastyear');
};

/**
 * OBTENER LAS ESTADÍSTICAS POR INTERVALO
 *
 * @param {Number} begin La fecha de inicio en formato 20140324
 * @param {Number} end La fecha de fin en formato 20140327
 */
MobPartner.prototype.interval = function(begin, end){

    // Creamos la url
    var url = createUrl.call(this, {
        key: this.key,
        login: this.login,
        data_begin: begin,
        data_end: end,
        format: 'csv'
    });

    return getResults(url);

};

module.exports = MobPartner;