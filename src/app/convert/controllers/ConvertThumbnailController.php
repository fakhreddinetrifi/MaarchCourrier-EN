<?php

/**
 * Copyright Maarch since 2008 under licence GPLv3.
 * See LICENCE.txt file at the root folder for more details.
 * This file is part of Maarch software.
 *
 */

/**
 * @brief Convert Thumbnail Controller
 * @author dev@maarch.org
 */

namespace Convert\controllers;

use Attachment\models\AttachmentModel;
use Convert\models\AdrModel;
use Docserver\controllers\DocserverController;
use Docserver\models\DocserverModel;
use Docserver\models\DocserverTypeModel;
use Parameter\models\ParameterModel;
use Resource\controllers\StoreController;
use Resource\models\ResModel;
use SrcCore\models\CoreConfigModel;
use SrcCore\models\ValidatorModel;

class ConvertThumbnailController
{
    private static function Bt_writeLog($args = [])
    {
        \SrcCore\controllers\LogsController::add([
            'isTech'    => true,
            'moduleId'  => $GLOBALS['batchName'],
            'level'     => $args['level'],
            'tableName' => '',
            'recordId'  => $GLOBALS['batchName'],
            'eventType' => $GLOBALS['batchName'],
            'eventId'   => $args['message']
        ]);
    }
    public static function convert(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId', 'type']);
        ValidatorModel::stringType($aArgs, ['type']);
        ValidatorModel::intVal($aArgs, ['resId']);

        if ($aArgs['type'] == 'resource') {
            $resource = ResModel::getById(['resId' => $aArgs['resId'], 'select' => ['filename', 'version']]);
            if (empty($resource)) {
                return ['errors' => '[ConvertThumbnail] Resource does not exist'];
            }
            if (empty($resource['filename'])) {
                return true;
            }

            $convertedDocument = AdrModel::getDocuments([
                'select'    => ['id', 'docserver_id', 'path', 'filename', 'fingerprint'],
                'where'     => ['res_id = ?', 'type in (?)', 'version = ?'],
                'data'      => [$aArgs['resId'], ['PDF', 'SIGN'], $resource['version']],
                'orderBy'   => ["type='SIGN' DESC"],
                'limit'     => 1
            ]);
            $convertedDocument = $convertedDocument[0] ?? null;
            if (!empty($convertedDocument) && empty($convertedDocument['fingerprint'])) {
                $docserver = DocserverModel::getByDocserverId(['docserverId' => $convertedDocument['docserver_id'], 'select' => ['path_template', 'docserver_type_id']]);
                $pathToDocument = $docserver['path_template'] . str_replace('#', DIRECTORY_SEPARATOR, $convertedDocument['path']) . $convertedDocument['filename'];
                if (is_file($pathToDocument)) {
                    $docserverType = DocserverTypeModel::getById(['id' => $docserver['docserver_type_id'], 'select' => ['fingerprint_mode']]);
                    $fingerprint = StoreController::getFingerPrint(['filePath' => $pathToDocument, 'mode' => $docserverType['fingerprint_mode']]);
                    AdrModel::updateDocumentAdr(['set' => ['fingerprint' => $fingerprint], 'where' => ['id = ?'], 'data' => [$convertedDocument['id']]]);
                    $convertedDocument['fingerprint'] = $fingerprint;
                }
            }
        } else {
            self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 1 ------"]);
            $resource = AttachmentModel::getById(['id' => $aArgs['resId'], 'select' => [1]]);
            $i = 0;
            foreach ($resource as $key => $value) {
                self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 2.$i ------ KEY = $key / VALUE = $value"]);
                $i++;
            }
            if (empty($resource)) {
                return ['errors' => '[ConvertThumbnail] Resource does not exist'];
            }

            $convertedDocument = AdrModel::getConvertedDocumentById([
                'select'    => ['id', 'docserver_id','path', 'filename', 'fingerprint'],
                'resId'     => $aArgs['resId'],
                'collId'    => 'attachment',
                'type'      => 'PDF'
            ]);
            $i = 0;
            foreach ($convertedDocument as $key => $value) {
                self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 3.$i ------ KEY = $key / VALUE = $value"]);
                $i++;
            }
            if (!empty($convertedDocument)  && empty($convertedDocument['fingerprint'])) {
                self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 3 ------ "]);
            }

            if (!empty($convertedDocument) && empty($convertedDocument['fingerprint'])) {
                $docserver = DocserverModel::getByDocserverId(['docserverId' => $convertedDocument['docserver_id'], 'select' => ['path_template', 'docserver_type_id']]);
                $pathToDocument = $docserver['path_template'] . str_replace('#', DIRECTORY_SEPARATOR, $convertedDocument['path']) . $convertedDocument['filename'];
                self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 4 ------ $pathToDocument"]);
                if (is_file($pathToDocument)) {
                    $docserverType = DocserverTypeModel::getById(['id' => $docserver['docserver_type_id'], 'select' => ['fingerprint_mode']]);
                    $fingerprint = StoreController::getFingerPrint(['filePath' => $pathToDocument, 'mode' => $docserverType['fingerprint_mode']]);
                    AdrModel::updateAttachmentAdr(['set' => ['fingerprint' => $fingerprint], 'where' => ['id = ?'], 'data' => [$convertedDocument['id']]]);
                    $convertedDocument['fingerprint'] = $fingerprint;
                    self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 5 ------ $fingerprint"]);
                }
            }
        }

        if (empty($convertedDocument)) {
            return true;
        }

        $docserver = DocserverModel::getByDocserverId(['docserverId' => $convertedDocument['docserver_id'], 'select' => ['path_template']]);
        $i = 0;
        foreach ($docserver as $key => $value) {
            self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 6.$i ------ KEY = $key / VALUE = $value"]);
            $i++;
        }
        $pathToDocument = $docserver['path_template'] . str_replace('#', DIRECTORY_SEPARATOR, $convertedDocument['path']) . $convertedDocument['filename'];
        self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 7 ------ $pathToDocument"]);
        if (!file_exists($pathToDocument)) {
            return ['errors' => '[ConvertThumbnail] Document does not exist on docserver'];
        }

        $ext           = pathinfo($pathToDocument, PATHINFO_EXTENSION);
        $filename      = pathinfo($pathToDocument, PATHINFO_FILENAME);
        $tmpPath       = CoreConfigModel::getTmpPath();
        $fileNameOnTmp = rand() . $filename;
        self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 8 ------ $filename"]);
        if (in_array($ext, ['maarch', 'html'])) {
            if ($ext == 'maarch') {
                copy($pathToDocument, "{$tmpPath}{$fileNameOnTmp}.html");
                $pathToDocument = "{$tmpPath}{$fileNameOnTmp}.html";
                self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 8.1 ------ $pathToDocument"]);
            }
            $command = "wkhtmltoimage --height 600 --width 400 --quality 100 --zoom 0.2 "
                . escapeshellarg($pathToDocument) . ' ' . escapeshellarg("{$tmpPath}{$fileNameOnTmp}.png");
        } else {
            $size = '750x900';
            $parameter = ParameterModel::getById(['id' => 'thumbnailsSize', 'select' => ['param_value_string']]);
            $i = 0;
            foreach ($parameter as $key => $value) {
                self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 9.$i ------ KEY = $key / VALUE = $value"]);
                $i++;
            }
            if (!empty($parameter) && preg_match('/^[0-9]{3,4}[x][0-9]{3,4}$/', $parameter['param_value_string'])) {
                $size = $parameter['param_value_string'];
                self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 10 ------ $size"]);
            }
            self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 11 ------ tmpPath == $tmpPath / fileNameOnTmp == $fileNameOnTmp"]);
            $command = "convert -thumbnail {$size} -background white -alpha remove "
                . escapeshellarg($pathToDocument) . '[0] ' . escapeshellarg("{$tmpPath}{$fileNameOnTmp}.png");
        }
        exec($command.' 2>&1', $output, $return);
        self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 11 ------ $return"]);
        if ($return !== 0) {
            return ['errors' => "[ConvertThumbnail] ".implode(" ", $output)];
        }

        $content = file_get_contents("{$tmpPath}{$fileNameOnTmp}.png");
        self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 12 ------ $content"]);
        $storeResult = DocserverController::storeResourceOnDocServer([
            'collId'            => $aArgs['type'] == 'resource' ? 'letterbox_coll' : 'attachments_coll',
            'docserverTypeId'   => 'TNL',
            'encodedResource'   => base64_encode($content),
            'format'            => 'png'
        ]);
        $i = 0;
        foreach ($storeResult as $key => $value) {
            self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 13.$i ------ KEY = $key / VALUE = $value"]);
            $i++;
        }
        if (!empty($storeResult['errors'])) {
            return ['errors' => "[ConvertThumbnail] {$storeResult['errors']}"];
        }

        if ($aArgs['type'] == 'resource') {
            AdrModel::createDocumentAdr([
                'resId'         => $aArgs['resId'],
                'type'          => 'TNL',
                'docserverId'   => $storeResult['docserver_id'],
                'path'          => $storeResult['destination_dir'],
                'filename'      => $storeResult['file_destination_name'],
                'version'       => $resource['version']
            ]);
        } else {
            self::Bt_writeLog(['level' => 'INFO', 'message' => "----- ConvertThumbnailController ------ TRACE 14 ------"]);
            AdrModel::createAttachAdr([
                'resId'         => $aArgs['resId'],
                'type'          => 'TNL',
                'docserverId'   => $storeResult['docserver_id'],
                'path'          => $storeResult['destination_dir'],
                'filename'      => $storeResult['file_destination_name']
            ]);
        }

        return true;
    }
}
