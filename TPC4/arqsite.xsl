<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <xsl:result-document href="arqsite/index.html">
            <html>
                <head>
                    <title>Locais de interesse arqueológico</title>
                </head>
                <body>
                    <h3>Tabela periódica dos elementos</h3>
                    <ul>
                        <xsl:apply-templates mode="indice" select="//ARQELEM">
                            <xsl:sort select="IDENTI"/>
                        </xsl:apply-templates> 
                    </ul>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="ARQELEM" mode="indice">
        <li>
            <a name="i{generate-id()}"/>
            <a href="{generate-id()}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    
    <xsl:template match="ARQELEM">
        <xsl:result-document href="arqsite/{generate-id()}.html">
            <html>
                <head>
                    <title><xsl:value-of select="IDENTI"/></title>
                </head>
                <body>
                    <p><b>Descrição</b>: <xsl:value-of select="DESCRI/LIGA"/></p>
                    <p><b>Lugar</b>: <xsl:value-of select="LUGAR"/></p>
                    <p><b>Freguesia</b>: <xsl:value-of select="FREGUE"/></p>
                    <p><b>Concelho</b>: <xsl:value-of select="CONCEL"/></p>
                    <p><b>Código Administrativo</b>: <xsl:value-of select="CODADM"/></p>
                    <p><b>Latitude</b>: <xsl:value-of select="LATITU"/></p>
                    <p><b>Longitude</b>: <xsl:value-of select="LONGIT"/></p>
                    <p><b>Altitude</b>: <xsl:value-of select="ALTITU"/></p>
                    <xsl:if test="ACESSO">
                        <p><b>Acesso</b>: 
                            <xsl:value-of select="ACESSO"/> 
                        </p> 
                    </xsl:if>
                    <p><b>Quadro</b>: <xsl:value-of select="QUADRO"/></p>
                    <p><b>Desarquivamento</b>: <xsl:value-of select="DESARQ"/></p>
                    <xsl:if test="INTERP">
                        <p><b>Interpretação</b>: 
                            <xsl:value-of select="INTERP/LIGA"/> 
                        </p> 
                    </xsl:if>
                    <p><b>Depósito</b>: <xsl:value-of select="DEPOSI"/></p>
                    <p><b>Bibliografia</b>: <xsl:value-of select="BIBLIO"/></p>
                    <p><b>Autor</b>: <xsl:value-of select="AUTOR"/></p>
                    <p><b>Data</b>: <xsl:value-of select="DATA"/></p>
                    
                    <!--xsl:if test="HEAT_OF_FUSION">
                        <p><b>Ponto de fusão</b>: 
                            <xsl:value-of select="HEAT_OF_FUSION"/> 
                            <xsl:value-of select="HEAT_OF_FUSION/@UNITS"/>
                        </p> 
                    </xsl:if>-->
                    <address>[<a href="index.html#i{generate-id()}">Voltar ao índice</a>]</address>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
    
</xsl:stylesheet>